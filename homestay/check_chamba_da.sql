SELECT username, full_name, role, district
FROM users
WHERE district ILIKE '%Chamba%' OR district ILIKE '%Dalhousie%';
