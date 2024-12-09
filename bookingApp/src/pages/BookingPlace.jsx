import { useParams } from "react-router-dom";

export default function BookingPlace() {
  const { id } = useParams();
  return <div>Single Booking: {id}</div>;
}
