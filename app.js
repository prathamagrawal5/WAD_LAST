const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Create a studentmarks collection schema
const studentMarksSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number
});

// Create a studentmarks model
const StudentMarks = mongoose.model('studentmarks', studentMarksSchema);

// Create a new document in the studentmarks collection
app.get('/createDocument', (req, res) => {
  const documents = [
    {
      Name: 'John Doe',
      Roll_No: 1,
      WAD_Marks: 80,
      CC_Marks: 75,
      DSBDA_Marks: 25,
      CNS_Marks: 85,
      AI_Marks: 90
    },
    {
      Name: 'Jane Smith',
      Roll_No: 2,
      WAD_Marks: 70,
      CC_Marks: 85,
      DSBDA_Marks: 15,
      CNS_Marks: 95,
      AI_Marks: 80
    },
    // Add more documents here
  ];

  StudentMarks.insertMany(documents)
    .then(() => {
      res.send('Documents inserted successfully');
    })
    .catch((error) => {
      console.error('Error inserting documents:', error);
      res.status(500).send('Error inserting documents');
    });
});

// Get the total count of documents and list all documents
app.get('/listDocuments', (req, res) => {
  StudentMarks.countDocuments()
    .then((count) => {
      StudentMarks.find()
        .then((documents) => {
          res.send(`Total count: ${count} \n Documents: ${JSON.stringify(documents)}\n`);
        })
        .catch((error) => {
          console.error('Error fetching documents:', error);
          res.status(500).send('Error fetching documents');
        });
    })
    .catch((error) => {
      console.error('Error counting documents:', error);
      res.status(500).send('Error counting documents');
    });
});

// Get the names of students who got more than 20 marks in DSBDA subject
app.get('/listStudentsAbove20', (req, res) => {
  StudentMarks.find({ DSBDA_Marks: { $gt: 20 } }, 'Name')
    .then((students) => {
      res.send(`Students with more than 20 marks in DSBDA: ${students.map(student => student.Name)}`);
    })
    .catch((error) => {
      console.error('Error fetching students:', error);
      res.status(500).send('Error fetching students');
    });
});

// Update the marks of specified students by 10
app.get('/updateMarks', (req, res) => {
  const studentIdsToUpdate = ['studentId1', 'studentId2']; // Provide the actual student IDs to update

  StudentMarks.updateMany({ _id: { $in: studentIdsToUpdate } }, { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_Marks: 10 } })
    .then(() => {
      res.send('Marks updated successfully');
    })
    .catch((error) => {
      console.error('Error updating marks:', error);
      res.status(500).send('Error updating marks');
    });
});

// Get the names of students who got more than 25 marks in all subjects
app.get('/listStudentsAbove25InAllSubjects', (req, res) => {
  StudentMarks.find({ $and: [{ WAD_Marks: { $gt: 25 } }, { CC_Marks: { $gt: 25 } }, { DSBDA_Marks: { $gt: 25 } }, { CNS_Marks: { $gt: 25 } }, { AI_Marks: { $gt: 25 } }] }, 'Name')
    .then((students) => {
      res.send(`Students with more than 25 marks in all subjects: ${students.map(student => student.Name)}`);
    })
    .catch((error) => {
      console.error('Error fetching students:', error);
      res.status(500).send('Error fetching students');
    });
});

// Get the names of students who got less than 40 in both Maths and Science
app.get('/listStudentsBelow40InMathsAndScience', (req, res) => {
  StudentMarks.find({ $and: [{ WAD_Marks: { $lt: 40 } }, { CC_Marks: { $lt: 40 } }] }, 'Name')
    .then((students) => {
      res.send(`Students with less than 40 marks in Maths and Science: ${students.map(student => student.Name)}`);
    })
    .catch((error) => {
      console.error('Error fetching students:', error);
      res.status(500).send('Error fetching students');
    });
});

// Remove a specified student document from the collection
app.get('/removeStudent', (req, res) => {
  const studentIdToRemove = 'studentId'; // Provide the actual student ID to remove

  StudentMarks.deleteOne({ _id: studentIdToRemove })
    .then(() => {
      res.send('Student removed successfully');
    })
    .catch((error) => {
      console.error('Error removing student:', error);
      res.status(500).send('Error removing student');
    });
});

// Get all student data and display in tabular format
app.get('/displayStudents', (req, res) => {
  StudentMarks.find()
    .then((students) => {
      let table = '<table><tr><th>Name</th><th>Roll No</th><th>WAD Marks</th><th>CC Marks</th><th>DSBDA Marks</th><th>CNS Marks</th><th>AI Marks</th></tr>';

      students.forEach((student) => {
        table += `<tr><td>${student.Name}</td><td>${student.Roll_No}</td><td>${student.WAD_Marks}</td><td>${student.CC_Marks}</td><td>${student.DSBDA_Marks}</td><td>${student.CNS_Marks}</td><td>${student.AI_Marks}</td></tr>`;
      });

      table += '</table>';

      res.send(table);
    })
    .catch((error) => {
      console.error('Error fetching students:', error);
      res.status(500).send('Error fetching students');
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// app.use(express.json());

// mongoose.connect('mongodb://localhost/music', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

// const songSchema = new mongoose.Schema({
//   songname: String,
//   film: String,
//   music_director: String,
//   singer: String,
//   actor: String,
//   actress: String
// });

// const Song = mongoose.model('Song', songSchema);

// // Insert 5 song documents
// const songs = [
//   { songname: 'Song 1', film: 'Film 1', music_director: 'Director 1', singer: 'Singer 1' },
//   { songname: 'Song 2', film: 'Film 2', music_director: 'Director 2', singer: 'Singer 2' },
//   { songname: 'Song 3', film: 'Film 3', music_director: 'Director 1', singer: 'Singer 3' },
//   { songname: 'Song 4', film: 'Film 4', music_director: 'Director 3', singer: 'Singer 4' },
//   { songname: 'Song 5', film: 'Film 5', music_director: 'Director 2', singer: 'Singer 1' }
// ];

// Song.insertMany(songs)
//   .then(() => {
//     console.log('Songs inserted successfully');
//   })
//   .catch((error) => {
//     console.error('Error inserting songs:', error);
//   });

// // Display total count of documents and list all the documents
// app.get('/songs', (req, res) => {
//   Song.find()
//     .then((songs) => {
//       const count = songs.length;
//       res.send(`Total count: ${count}\n\n${songs}`);
//     })
//     .catch((error) => {
//       console.error('Error retrieving songs:', error);
//       res.status(500).send('Error retrieving songs');
//     });
// });

// // List songs by specified Music Director
// app.get('/songs/music-director/:director', (req, res) => {
//   const musicDirector = req.params.director;

//   Song.find({ music_director: musicDirector })
//     .then((songs) => {
//       res.send(songs);
//     })
//     .catch((error) => {
//       console.error('Error retrieving songs:', error);
//       res.status(500).send('Error retrieving songs');
//     });
// });

// // List songs by specified Music Director sung by specified Singer
// app.get('/songs/music-director/:director/singer/:singer', (req, res) => {
//   const musicDirector = req.params.director;
//   const singer = req.params.singer;

//   Song.find({ music_director: musicDirector, singer: singer })
//     .then((songs) => {
//       res.send(songs);
//     })
//     .catch((error) => {
//       console.error('Error retrieving songs:', error);
//       res.status(500).send('Error retrieving songs');
//     });
// });

// // Delete a song
// app.delete('/songs/:id', (req, res) => {
//   const songId = req.params.id;

//   Song.findByIdAndDelete(songId)
//     .then(() => {
//       res.send('Song deleted successfully');
//     })
//     .catch((error) => {
//       console.error('Error deleting song:', error);
//       res.status(500).send('Error deleting song');
//    });

// // Add a new song
// app.post('/songs', (req, res) => {
//   const { songname, film, music_director, singer } = req.body;

//   const newSong = new Song({ songname, film, music_director, singer });
//   newSong.save()
//     .then(() => {
//       res.send('New song added successfully');
//     })
//     .catch((error) => {
//       console.error('Error adding new song:', error);
//       res.status(500).send('Error adding new song');
//     });
// });

// // List songs sung by a specified Singer from a specified film
// app.get('/songs/film/:film/singer/:singer', (req, res) => {
//   const film = req.params.film;
//   const singer = req.params.singer;

//   Song.find({ film: film, singer: singer })
//     .then((songs) => {
//       res.send(songs);
//     })
//     .catch((error) => {
//       console.error('Error retrieving songs:', error);
//       res.status(500).send('Error retrieving songs');
//     });
// });

// // Update the document by adding Actor and Actress name
// app.put('/songs/:id', (req, res) => {
//   const songId = req.params.id;
//   const { actor, actress } = req.body;

//   Song.findByIdAndUpdate(songId, { actor: actor, actress: actress })
//     .then(() => {
//       res.send('Song updated successfully');
//     })
//     .catch((error) => {
//       console.error('Error updating song:', error);
//       res.status(500).send('Error updating song');
//     });
// });

// // Display the data in the browser in tabular format
// app.get('/songs', (req, res) => {
//   Song.find()
//     .then((songs) => {
//       const tableRows = songs.map((song) => {
//         return `<tr><td>${song.songname}</td><td>${song.film}</td><td>${song.music_director}</td><td>${song.singer}</td></tr>`;
//       });

//       const table = `<table><thead><tr><th>Songname</th><th>Film</th><th>Music Director</th><th>Singer</th></tr></thead><tbody>${tableRows.join('')}</tbody></table>`;

//       res.send(table);
//     })
//     .catch((error) => {
//       console.error('Error retrieving songs:', error);
//       res.status(500).send('Error retrieving songs');
//     });
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
