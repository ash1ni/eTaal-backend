CREATE TABLE IF NOT EXISTS ServiceTransDetails(
    STD_ID int PRIMARY KEY,
    STD_Date timestamp default now(),
    Project varchar(255),
    service varchar(255),
    serviceTransCount int,
    stateCode varchar(20) 
);

-- INSERT INTO ServiceTransDetails (STD_ID, Project, service, serviceTransCount, stateCode)
-- VALUES
--   (11, 'Commercial Tax', 'EWAYBILL', 211563, 'GOA'),
--   (12, 'Commercial Tax', 'EWAYBILL', 128093, 'CHANDIGARH');
--   (4, 'Education', 'Student registration for availing College Scholarships',  34063	, 'MADHYAPRADESH'),
--   (5, 'Certificate', 'Income Certificate', 6606, 'Haryana'),
--   (6, 'State Specific Services', 'Transit Form', 120520, 'Arunachal Pradesh'),
--   (7, 'Land Revenue', 'Current Adangal / Pahani', 10920, 'AP'),
--   (8, 'Health', 'E-cards Generation', 1137139, 'HP'),
--   (9, 'Transport', 'DL Issued', 34030, 'HP'),
--   (10, 'Public Distribution System', 'Sale of Ration at Fair Price Shop', 3071145, 'GUJARAT');
--  UPDATE  ServiceTransDetails SET Project = 'Transport', service='DL Registered' where STD_ID=2;