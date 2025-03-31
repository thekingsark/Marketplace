export const BuyCoinsCard = (props: {
  title: React.ReactNode
  selected: boolean
  description?: React.ReactNode
  handleSelect: () => void
}) => {
  const { title, description, selected, handleSelect } = props

  return (
    <div
      className={`buy-coins-card-root p-16 mt-10 cursor-pointer ${selected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="d-flex align-items-center gap-2 m-0">
        {title}
      </div>
      {description}
      <style jsx>{`
        .buy-coins-card-root {
          border-radius: 6px;
          box-shadow: 1px 1px 3px rgba(37, 52, 103, 0.11);
          background: var(--background_4);
          border: 1px solid transparent;
        }
        .buy-coins-card-root:hover {
          background: var(--background_3);
        }
        .selected {
          border: 1px solid var(--call_to_action);
          background: var(--transparent_call_to_action) !important;
        }
        .buy-coins-btn {
          background: #fff;
          color: #000;
        }
      `}</style>
    </div>
  )
}
