alter table profiles add column email text;
alter table profiles add column phone text;
alter table profiles add column address text;
alter table profiles add column status text;
alter table profiles add column notes text;
alter table profiles add column updated_at timestamp with time zone default now();
