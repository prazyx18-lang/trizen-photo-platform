    import { useEffect, useState } from "react";
    import "./Events.css";

    function Events() {

    const [events, setEvents] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");

    const [loading, setLoading] = useState(true);

// GET EVENTS
const fetchEvents = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://trizen-photo-platform-api.onrender.com/api/events",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            setEvents(data);
        }

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};


useEffect(() => {

    fetchEvents();

}, []);


// CREATE EVENT
const handleCreateEvent = async (e) => {

    e.preventDefault();

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://trizen-photo-platform-api.onrender.com/api/events",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name,
                    description,
                    event_date: eventDate
                })
            }
        );

        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert("Event created successfully 🎉");

        // Clear form
        setName("");
        setDescription("");
        setEventDate("");


        // Refresh events
        fetchEvents();


        } catch (error) {

        console.error(error);

        alert("Something went wrong");

        }

    };


    return (

    <div className="events-container">
        <h1>📅 Events Management</h1>

        <p>Create and manage photography events.</p>


        {/* CREATE EVENT FORM */}

<form
  onSubmit={handleCreateEvent}
  className="event-form"
>

  <h2>Create New Event</h2>

  <input
    type="text"
    placeholder="Event Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <textarea
    placeholder="Event Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
  />

  <input
    type="date"
    value={eventDate}
    onChange={(e) => setEventDate(e.target.value)}
    required
  />

  <button type="submit">
    ➕ Create Event
  </button>

</form>

      <hr style={{ margin: "40px 0" }} />


      <h2>All Events</h2>


      {loading ? (

        <p>Loading events...</p>

      ) : events.length === 0 ? (

        <p>No events found.</p>

      ) : (

        events.map((event) => (

          <div
            key={event.id}
            style={{
              background: "white",
              padding: "20px",
              marginTop: "20px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
          >

            <h2>{event.name}</h2>

            <p>{event.description}</p>

            <p>
              📅 {new Date(event.event_date).toLocaleDateString()}
            </p>

          </div>

        ))

      )}

    </div>

  );

}

export default Events;