-- Set admin@periodcalm.com as ADMIN
update profiles set role = 'ADMIN' where email = 'admin@periodcalm.com';

-- Set testuser@gmail.com as USER
update profiles set role = 'USER' where email = 'testuser@gmail.com'; 