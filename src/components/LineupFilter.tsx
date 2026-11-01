interface LineupFilterProps {
  lineups: string[];
  onSelect: (lineup: string | null) => void;
  activeLineup: string | null;
}

export function LineupFilter({ lineups, onSelect, activeLineup }: LineupFilterProps) {
  return (
    <div className="hw-filters flex flex-wrap gap-2">
      {lineups.map((lineup) => (
        <div
          key={lineup}
          className={`filter-chip ${activeLineup === lineup ? 'active' : ''}`}
          onClick={() => onSelect(activeLineup === lineup ? null : lineup)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelect(activeLineup === lineup ? null : lineup);
          }}
        >
          {lineup}
        </div>
      ))}
    </div>
  );
}
