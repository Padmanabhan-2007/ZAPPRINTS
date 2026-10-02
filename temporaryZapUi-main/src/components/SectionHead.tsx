import React from 'react';
import Reveal from './Reveal';

interface SectionHeadProps {
  num?: string;
  label?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}

const SectionHead: React.FC<SectionHeadProps> = ({ title, intro }) => (
  <Reveal className="sec-head">
    <h2 className="sec-title">{title}</h2>
    {intro && <p className="sec-intro">{intro}</p>}
  </Reveal>
);

export default SectionHead;
