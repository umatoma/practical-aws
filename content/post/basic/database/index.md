---
title: "AWS データベース基礎"
date: 2021-12-10
slug: basic-database
categories: [basic]
tags: [RDS, DynamoDB, ElasticCache, S3]
image: basic-database.jpg
draft: true
---

## コンピューティング基礎

ここでは、RDS・DynamoDBといった、アプリケーションで扱うことで保存するデータベース部分の知識を整理します。


## RDS

「Relational Database Service（RDS）」とは、マネージドRDBサービスです。
データベースエンジンとして、MySQL・PostgreSQL・MariaDB・Oracle・SQL Serverに加え、AWS独自の「Aurora」が選択できます。

RDSでは運用に関わる様々な作業がAWS側で行われるようになっていて、EC2上に構築した場合に比べ様々な面でコストを削減できます。
また、複数アベイラビリティゾーンにDBインスタンスを配置したり、リードレプリカを配置するなど、可用性を高める構成を簡単に構築できるようになっています。

複数あるデータベースエンジンの中でも、AuroraはAWS独自のエンジンです。
MySQL・PostgreSQLと互換性を持っているため、同じSQLや接続方法で使うことができます。
標準的なMySQL・PostgreSQLと比べ、パフォーマンスや可用性に関して優れているのが特徴です。

![](group-basic-rds.png)


## DynamoDB

TBD


## ElasticCache

TBD


## S3

TBD


## まとめ

TBD
