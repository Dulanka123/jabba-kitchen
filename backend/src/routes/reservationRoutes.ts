import express from 'express';
import Reservation from '../models/Reservation';

const router = express.Router();

// 1. අලුත් Booking එකක් දැමීම (CREATE)
router.post('/', async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).json({ message: "Table Reserved Successfully!", reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: "Reservation Failed", error });
    }
});

// 2. Bookings ඔක්කොම ගැනීම (Admin සඳහා)
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Fetching Failed", error });
    }
});

// ... උඩින් තියෙන GET සහ POST routes එහෙමම තියන්න ...

// 3. Booking Status වෙනස් කිරීම (Approve/Reject)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body; // 'Confirmed' or 'Cancelled'
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "Update Failed", error });
    }
});

// export default router; (මේක යටින්ම තියෙන්න ඕන)

export default router;