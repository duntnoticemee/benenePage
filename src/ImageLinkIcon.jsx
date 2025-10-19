import STAR_ICON_URL from './assets/icon_star.webp'
import useHoverSound from './useHoverSound';

// -----------------------------------------------------------------------------
// ImageLinkIcon
// -----------------------------------------------------------------------------
const ImageLinkIcon = ({ label, onClick }) => {
  const playonClick = useHoverSound('/open.wav', 0.6);
  return (
    <div
      
      style={{
        margin: '0 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      // sound + click logic here
      onClick={(e) => {
        playonClick(); //  plays sound when clicked
        if (onClick) onClick(e); // 🔗 still triggers your open-card logic
      }}
    >
      <img
        src={STAR_ICON_URL}
        alt={label}
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          padding: 8,
          objectFit: 'contain',
          display: 'block',
        }}
      />
      <span style={{ marginTop: 6, fontSize: 15 }}>{label}</span>
    </div>);
  
};
export default ImageLinkIcon;