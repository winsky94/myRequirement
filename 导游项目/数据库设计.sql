#用户
create table user(
	id int not null primary key auto_increment,
	name varchar(20) not null default "null",
	password varchar(40) not null,
	type varchar(10) not null,
	createdAt date not null
	);

#朋友关系
create table friendRelation(
	id int not null primary key auto_increment,
	name varchar(20) not null default "null",
	friend varchar(20) not null default "null",
	createdAt date not null
	);

#圈子动态
create table moment(
	id int not null primary auto_increment,
	authorId int not null,
	content varchar(400) not null,
	image varchar(40) not null,
	createdAt date not null
	);

#动态点赞
create table likingMoment(
	id int not null primary auto_increment,
	userId int not null,
	momentId int not null
	createdAt date not null
	);

#动态评论
create table momentComment(
	id int not null primary auto_increment,
	authorId int not null,
	toUserId int not null,
	momentId int not null,
	content varchar(400) not null,
	createdAt date not null
	);

#游客评论
