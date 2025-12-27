-- Initialize BHXH Calculator Database

-- Create coefficient table
CREATE TABLE IF NOT EXISTS coefficient (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL DEFAULT 1,
    coefficient DECIMAL(10, 4) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_to TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coefficient_year_month ON coefficient(year, month);
CREATE INDEX IF NOT EXISTS idx_coefficient_active ON coefficient(is_active) WHERE is_active = TRUE;

-- Insert coefficient data (based on Thông tư 01/2025/TT-BLĐTBXH)
-- These are example values - should be updated with official data
INSERT INTO coefficient (year, month, coefficient, effective_from, effective_to, is_active) VALUES
(2024, 1, 1.00, '2024-01-01', '2024-12-31', TRUE),
(2023, 1, 1.08, '2023-01-01', '2023-12-31', TRUE),
(2022, 1, 1.18, '2022-01-01', '2022-12-31', TRUE),
(2021, 1, 1.29, '2021-01-01', '2021-12-31', TRUE),
(2020, 1, 1.41, '2020-01-01', '2020-12-31', TRUE),
(2019, 1, 1.52, '2019-01-01', '2019-12-31', TRUE),
(2018, 1, 1.64, '2018-01-01', '2018-12-31', TRUE),
(2017, 1, 1.75, '2017-01-01', '2017-12-31', TRUE),
(2016, 1, 1.85, '2016-01-01', '2016-12-31', TRUE),
(2015, 1, 1.96, '2015-01-01', '2015-12-31', TRUE),
(2014, 1, 2.06, '2014-01-01', '2014-12-31', TRUE),
(2013, 1, 2.18, '2013-01-01', '2013-12-31', TRUE),
(2012, 1, 2.29, '2012-01-01', '2012-12-31', TRUE),
(2011, 1, 2.41, '2011-01-01', '2011-12-31', TRUE),
(2010, 1, 2.53, '2010-01-01', '2010-12-31', TRUE),
(2009, 1, 2.67, '2009-01-01', '2009-12-31', TRUE),
(2008, 1, 2.85, '2008-01-01', '2008-12-31', TRUE),
(2007, 1, 3.05, '2007-01-01', '2007-12-31', TRUE),
(2006, 1, 3.28, '2006-01-01', '2006-12-31', TRUE),
(2005, 1, 3.52, '2005-01-01', '2005-12-31', TRUE),
(2004, 1, 3.78, '2004-01-01', '2004-12-31', TRUE),
(2003, 1, 4.05, '2003-01-01', '2003-12-31', TRUE),
(2002, 1, 4.35, '2002-01-01', '2002-12-31', TRUE),
(2001, 1, 4.67, '2001-01-01', '2001-12-31', TRUE),
(2000, 1, 5.00, '2000-01-01', '2000-12-31', TRUE)
ON CONFLICT (year, month) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_coefficient_updated_at
BEFORE UPDATE ON coefficient
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
