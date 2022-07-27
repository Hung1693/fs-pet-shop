drop table if exists pets;
create table pets (
  id serial primary key,
  name text,
  kind text
);
insert into pets (name, kind) values ('1', '1'), ('2', '2');
select * from pets;