SELECT 
    id, username, full_name, role, district 
FROM users 
WHERE district ILIKE '%Chamba%';
