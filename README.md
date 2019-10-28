# Commands

## Active debugger

```sh
$ SLS_DEBUG=*
```

## Deploy

```sh
$ sls deploy
```

## Run all local

```sh
$ sls offline
```

## Run schedule jobs

```sh
$ sls schedule
```

## Create migration

```sh
$ sls migrations create --name <name>
```

## Run migrations

```sh
$ sls migrations down -t=3
$ sls migrations up
```

# Funcionando
docker-compose up
docker-compose run node sls migrations up
Lambda conversando com o SQS

# Todo

OK - Pesquisar https://www.npmjs.com/package/serverless-dotenv-plugin para usar um .env par ao serverless e para o docker

OK - Arrumar dockers

OK - Fazer setup de stocks

OK - Criar fila para o setup ou usar uma para tudo?

OK - Criar handler para cuidar dessa fila

Fazer setup de STOCH

Fazer setup de RSI

Fazer setup de ADX


..
..



Arrumar estrutura de pastas