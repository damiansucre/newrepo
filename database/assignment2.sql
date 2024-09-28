-- 1 new record to the account table
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n');

-- 2 Update the account type
UPDATE public.account SET account_type = 'Admin' WHERE account_id=1;

-- 3 Delete record from database
DELETE FROM public.account WHERE account_id=1;

-- 4 Another way to modify the cell content
UPDATE public.inventory 
SET inv_description = REPLACE ('Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    'small interiors', 'a huge interior' )
WHERE inv_id = 10;

-- 5 Inner join
SELECT 
    inv_make,
    inv_model,
    classification_name
FROM
    public.inventory
INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;

-- 6 Replace data in cell
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image,'/images', '/images/vehicles');
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');