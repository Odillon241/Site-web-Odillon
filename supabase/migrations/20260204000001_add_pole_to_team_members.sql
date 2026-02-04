-- Add pole field to team_members table for organigramme positioning
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS pole TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN team_members.pole IS 'Pôle de l''organigramme: Direction Générale, Pôle Administratif, Pôle Audit et Conformité, Pôle Qualité et Développement, Pôle Informatique et Communication';

-- Create index for filtering by pole
CREATE INDEX IF NOT EXISTS idx_team_members_pole ON team_members(pole) WHERE pole IS NOT NULL;
