const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

//ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some Error occured");
  }
});

//ROUTE 2: Add a new  note using: POST "/api/notes/addnotes". Login Required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some Error occured");
    }
  }
);

//ROUTE 3: update an existing note using: PUT "/api/notes/updatenotes". Login Required
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (description) {
      newNotes.description = description;
    }
    if (tag) {
      newNotes.tag = tag;
    }

    //Find the note to be update and update it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      res.status(404).send("Not found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNotes },
      { new: true }
    );
    res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some Error occured");
  }
});

//ROUTE 4: delete an existing note using: DELETE "/api/notes/deletenotes". Login Required
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  //const { title, description, tag } = req.body;

  try {
    //Find the note to be delete and delete it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      res.status(404).send("Not found");
    }

    //Allow deletion only if user owns this note
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", notes: notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some Error occured");
  }
});

module.exports = router;
