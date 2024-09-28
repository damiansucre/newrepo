-- Create table
CREATE TABLE "user"(
    id SERIAL PRIMARY KEY, -- INT -> +1
    name VARCHAR (100), --VARCHAR = TEXT has a constraint on size
    email VARCHAR(255),
    password TEXT,
    age INT
);

-- Insert data
INSERT INTO "user" (email, name, age,
password) VALUES ('troy@fake.email', 
'Troy', 26, 'jsjdjlsdjflsdfjls');

-- select example
SELECT account_type, FROM public.account WHERE account_id=1

-- Modify example


-- Delete example
DELETE FROM "user" WHERE id=2;

-- Delete all users
DELETE * FROM "user";
