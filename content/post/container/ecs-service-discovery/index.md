---
title: "ECS Service Discoveryを使ったService間連携"
date: 2021-12-22
slug: ecs-service-discovery
categories: [container]
tags: [ECS, Terraform]
image: group-container-ecs-service-discovery-architecture.png
draft: true
---

## 作成するシステム構成

ここでは、次のようなシステム構成を構築します。

![](group-container-ecs-service-discovery-architecture.png)


複数のECS Service間でリクエストを行えるシステム構成です。
ECS Service Discoveryにより、DNS名をもとにECS Serviceに対してリクエストを行えます。

ALBと連携することでも、DNS名をもとにECS Serviceに対してリクエストを行える状況にできます。
ですが、ECS Service Discoveryを使うことにで、より手軽に構築できます。

近年はコンテナ・サーバーレスなどコストをかけずにシステム構成を拡張できるようになりました。
それにより、マイクロサービスを採用したシステム構成が実現しやすくなっています。
そして、ECS Service Discoveryを使うことで、コンテナをベースとしたマイクロサービス構成をより手軽に構築できるようになります。

また、システム構成をコードで管理できるようTerraformを使い構築を進めていきます。
これにより、Production・Developmentといった複数環境に同等の構成を簡単に構築できるようになります。

それでは、順番にシステムの構築を進めていきましょう。


## ネットワーク構築

まずは、VPC・Subnetといったネットワーク部分の構築を進めます。

VPC内に異なるAZとなる２つのPublic Subnetを配置します。
Public SubnetなのでInternetへと通信できるようInternet GatewayをVPCに配置し、Route Tableも設定します。

この時、Service Discoveryを使うので、DNS・DNSホスト名の設定を有効にしておきます。
設定を無効にしたとしてもエラーにはなりませんが、DNS名からリクエストできない状態となるので注意が必要です。

```tf
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.70.0"
    }
  }
}

locals {
  app_name = "ecs_service_discovery"
}

provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      application = local.app_name
    }
  }
}

data "aws_caller_identity" "this" {}

####################################################
# VPC
####################################################

resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "${local.app_name}"
  }
}

####################################################
# Public Subnet
####################################################

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags = {
    Name = "${local.app_name}"
  }
}

resource "aws_subnet" "public_1" {
  vpc_id = aws_vpc.this.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "${local.app_name}-public_1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id = aws_vpc.this.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-northeast-1c"
  tags = {
    Name = "${local.app_name}-public_2"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = {
    Name = "${local.app_name}-public"
  }
}

resource "aws_route_table_association" "public_1_to_ig" {
  subnet_id = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2_to_ig" {
  subnet_id = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}
```


## セキュリティグループ構築

つぎに、VPC内のアプリケーションに設定するセキュリティグループの構築を進めます。

VPC内に複数のECS Serviceを配置し、互いにリクエストを行える状態にする必要があります。
なので、各ECS Serviceに共通のセキュリティグループを適用し、同セキュリティグループからの通信を許可することとします。

また、動作確認ができるようインターネットからのHTTP通信も許可しておきます。
本番の構成では、ALBなどを配置して直接ECS Serviceに通信できない構成が望ましいと思われます。

```tf
####################################################
# Application Security Group
####################################################

resource "aws_security_group" "app" {
  name = "${local.app_name}-app"
  description = "Security Group for Application"
  vpc_id = aws_vpc.this.id
  tags = {
    Name = "${local.app_name}-app"
  }
}

resource "aws_security_group_rule" "app_from_this" {
  security_group_id = aws_security_group.app.id
  type = "ingress"
  description = "Allow from This"
  from_port = 0
  to_port = 0
  protocol = "-1"
  self = true
}

resource "aws_security_group_rule" "app_from_any_http" {
  security_group_id = aws_security_group.app.id
  type = "ingress"
  description = "Allow from Any HTTP"
  from_port = 80
  to_port = 80
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "app_to_any" {
  security_group_id = aws_security_group.app.id
  type = "egress"
  description = "Allow to Any"
  from_port = 0
  to_port = 0
  protocol = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}
```

## Service Discovery 構築

TBD


## コンテナサービス構築

TBD



```
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity | jq -r .Account).dkr.ecr.ap-northeast-1.amazonaws.com
docker build --tag $(aws sts get-caller-identity | jq -r .Account).dkr.ecr.ap-northeast-1.amazonaws.com/ecs_service_discovery:latest ./
docker push $(aws sts get-caller-identity | jq -r .Account).dkr.ecr.ap-northeast-1.amazonaws.com/ecs_service_discovery:latest
```