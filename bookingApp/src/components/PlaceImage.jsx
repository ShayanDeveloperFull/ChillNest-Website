export default function PlaceImage({ place, idx = 0, className = null }) {
  if (!className) {
    className = "aspect-square object-cover";
  }

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://nestwebsite-backend.onrender.com";

  const imagePath = place.addedPhotos[idx].startsWith("uploads/")
    ? place.addedPhotos[idx]
    : `uploads/${place.addedPhotos[idx]}`;

  return (
    <div>
      <img className={className} src={`${baseURL}/${imagePath}`} alt="" />
    </div>
  );
}
