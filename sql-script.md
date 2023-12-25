drop table if exists carts;
drop table if exists cart_items;
drop type if exists cart_status;

create type cart_status as enum ('OPEN', 'ORDERED');

create table carts (
	id uuid not null default gen_random_uuid() primary key,
	user_id uuid not null,
	created_at date not null,
	updated_at date not null,
	status cart_status
);


create table cart_items (
	cart_id uuid not null,
	product_id uuid not null,
	count integer
);

insert into public.carts (id, user_id, created_at, updated_at, status)
values (gen_random_uuid(), gen_random_uuid(), current_date, current_date, 'OPEN'),
	   (gen_random_uuid(), gen_random_uuid(), current_date, current_date, 'ORDERED');

insert into public.cart_items (cart_id, product_id, count)
select id, gen_random_uuid(), ceil(random () * 10)
  from public.carts;
 
 select * from public.carts;
 select * from public.cart_items;
