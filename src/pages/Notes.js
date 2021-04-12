import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import NoteCard from "../components/NoteCard";
import Masonry from "react-masonry-css";

export default function Notes() {
  const [notes, setNotes] = useState([]);

    useEffect(() => {
    fetch("https://4pavetg9a3.execute-api.us-east-1.amazonaws.com/items")
    .then(response => response.body)
    .then(rb => {
      const reader = rb.getReader();
    
      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then( ({done, value}) => {
              // If there is no more data to read
              if (done) {
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              push();
            })
          }
          push();
        }
      });
    })
    .then(stream => {
      // Respond with our stream
      return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
    })
    .then(result => {
      // Do things with result
      var obj = JSON.parse(result);
      setNotes(obj.Items);
    });
  
  }, []);

/*   useEffect(() => {
    fetch("https://4pavetg9a3.execute-api.us-east-1.amazonaws.com/items")
      .then((res) => {
          res.json()
          console.log(res);
      })
      .then((data) => {
        setNotes(data)
      });
  
  }, []); */

  const handleDelete = async (id) => {
    await fetch("https://4pavetg9a3.execute-api.us-east-1.amazonaws.com/items/" + id, {
      method: "DELETE",
    });

    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

const breakpoints = {
  default: 3,
  1100: 2,
  700: 1
}

  return (
    <Container>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {notes.map((note) => (
          <div item key={note.id}>
            <NoteCard note={note} handleDelete={handleDelete} />
          </div>
        ))}
      </Masonry>
    </Container>
  );
}
