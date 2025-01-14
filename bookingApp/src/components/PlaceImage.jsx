export default function PlaceImage({ place, idx = 0, className = null }) {
  if (!className) {
    className = "aspect-square object-cover";
  }

  return (
    <div>
      <img
        className={className}
        src={`https://nestwebsite-backend.onrender.com/uploads/${place.addedPhotos[idx]}`}
        alt=""
      />
    </div>
  );
}
