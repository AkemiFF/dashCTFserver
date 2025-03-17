"use client"
import { AIChat } from '@/components/ai/ai';
import React from 'react';

// Charger AIChat uniquement côté client

const TestPage: React.FC = () => {
    return (
        <div className='mt-24'>
            <AIChat />
        </div>
    );
};

export default TestPage;