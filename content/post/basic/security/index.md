---
title: "AWS セキュリティ基礎"
date: 2021-12-11
slug: basic-security
categories: [basic]
tags: [IAM]
image: basic-security.jpg
draft: true
---

## セキュリティ基礎

ここでは、IAM・Systems Manager Parameter Storeといった、セキュリティ部分の知識を整理します。


## IAM

「Identity and Access Management（IAM）」とは、アクセス制御を行うサービスです。
誰が・どこに・何を・行えるのかを定義し、それを元にアクセスを許可・拒否できます。

アクセス制御の具体的なルールを記述したものが「IAMポリシー」です。
Action・Resource・Effectという3つの要素に基づいて、どこに・何を・行えるのか定義します。

AWS上の各リソースを操作するために「IAMユーザー」を作成できます。
パスワードを発行してAWSコンソールへとアクセスしたり、アクセスキーを発行してAPIリクエストしたりできます。

実行するAWSリソースなど一時的に権限を付与する場合は、「IAMロール」を使います。
IAMロールの中には複数のIAMポリシーが含まれていて、それを元にアクセス制御が行なえます。

この様にIAMを使うことで、各サービス・リソース間のアクセス制御を行えます。
ですが、RDSでMySQLを使う場合など、AWSに依存していない接続方法ではIAMを使えない場合があります。
そのような場合は、VPCのセキュリティグループなどによりアクセスを制限するといった方法を取ることも可能です。

![](group-basic-iam.png)


### Systems Manager Parameter Store

TBD


## まとめ

TBD
