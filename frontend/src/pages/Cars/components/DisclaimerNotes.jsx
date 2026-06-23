// src/components/carDetail/DisclaimerNotes.jsx
import React from 'react';

const DisclaimerNotes = ({ notes }) => (
    <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold mb-3">(*) Lưu ý:</p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                {notes.map((note, index) => <li key={index}>{note}</li>)}
            </ul>
        </div>
    </div>
);
export default DisclaimerNotes;