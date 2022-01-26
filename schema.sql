create database market_cubos;

drop table if not exists usuarios;

create table if not exists usuarios (
	id serial primary key not null,
  	nome varchar(30) not null,
  	nome_loja varchar(20) not null,
  	email varchar(30) not null unique,
  	senha text not null
)

drop table if not exists produtos;

create table if not exists produtos (
	id serial primary key not null,
  	usuario_id integer not null,
  	nome text not null,
  	quantidade integer,
  	categoria varchar(50) not null,
  	preco integer not null,
  	descricao text,
  	imagem text
)
