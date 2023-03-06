import React from 'react';

import OnEstLaTech from './onestlatech.png';
import CaisseDeGreve from './caisse.jpg';

export function StrikePlaceholder() {
  return (
    <div
      style={{
        fontFamily: 'courier',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <img width={300} src={OnEstLaTech} />
      <p>
        <span style={{ fontWeight: 'bold' }}>Secret-in.me</span> s&apos;oppose
        au projet de réforme des retraites profondément injuste défendu par le
        gouvernement d&apos;Emmanuel Macron.
      </p>
      <img height={200} src={CaisseDeGreve} />
      <p>
        <a
          style={{ fontWeight: 'bold', fontSize: 16 }}
          href="https://caisse-solidarite.fr/"
        >
          Faites un don à une caisse de grève
        </a>{' '}
        pour soutenir la lutte !
      </p>
      <p>Vos secrets reviendront dès le retrait de la réforme 😘</p>
    </div>
  );
}
