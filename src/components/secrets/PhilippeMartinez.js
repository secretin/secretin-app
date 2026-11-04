import PropTypes from 'prop-types';
import React from 'react';
import CaisseDeGreve from './caisse.jpg';
import OnEstLaTech from './onestlatech.png';

const linkStyle = { fontWeight: 'bold', fontSize: 16 };

function ExternalLink({ href, children }) {
  return (
    <a style={linkStyle} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

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
      <img width={300} src={OnEstLaTech} alt="On est la tech" />
      <p>
        <span style={{ fontWeight: 'bold' }}>Secret-in.me</span> est en grève
        générale. Emmanuel Macron n&apos;est que le dernier gérant en date
        d&apos;un demi-siècle de libéralisme qui a privatisé nos services
        publics, écrasé nos salaires et rogné nos droits, toujours au profit des
        mêmes.
      </p>
      <p>
        Nous ne venons pas négocier des miettes. Les richesses sont produites
        par les travailleuses et les travailleurs, pas par les actionnaires, et
        nous comptons bien les reprendre. Mais nous ne voulons pas seulement
        travailler moins ou mieux ! Nous voulons sortir d&apos;un monde où il
        faut vendre son temps pour avoir le droit de vivre.
      </p>
      <p>
        Ce qu&apos;il faut produire, comment et pour qui, c&apos;est à nous
        d&apos;en décider ensemble. Organisons-nous pour répondre aux besoins de
        tous·tes, à commencer par ceux des peuples du Sud, dont nos États
        occidentaux pillent le travail et les ressources.
      </p>
      <p>
        Nos ennemis ne sont pas de l&apos;autre côté des frontières, ce sont les
        puissant·es qui nous exploitent ici comme là-bas. Contre toutes les
        guerres impérialistes, solidarité avec le peuple palestinien face à la
        colonisation et aux massacres.{' '}
        <span role="img" aria-label="drapeau palestinien">
          🇵🇸
        </span>
      </p>
      <p>
        Nous soutenons celles et ceux qu&apos;ils appellent « casseurs », car
        iels ne renvoient qu&apos;une infime partie de la violence d&apos;un
        système qui broie nos vies, nos services publics et la planète. Soutien
        à toutes les personnes réprimées, interpellées et poursuivies.
      </p>
      <p>
        Nous dénonçons les violences policières, des contrôles au faciès aux
        mutilations et aux morts, dans les quartiers populaires comme dans les
        cortèges. La police ne nous protège pas, elle protège l&apos;ordre qui
        nous exploite, et la prison punit la pauvreté. Abolissons-les au plus
        vite, fermons les CRA, régularisons toutes les personnes sans papiers et
        inventons ensemble d&apos;autres façons de prendre soin les un·es des
        autres.
      </p>
      <p>
        Solidarité totale avec les lycéen·nes mobilisé·es, qui tiennent bon face
        aux intimidations et à la répression. Sans avenir, l&apos;école ne sert
        qu&apos;à trier et formater ! Leur colère est la nôtre.
      </p>
      <p>
        Rien de tout ça ne viendra des urnes. Nos droits ont toujours été
        arrachés par la grève, dans la rue et dans nos luttes quotidiennes, et
        c&apos;est là que tout se joue. Mais ça ne dispense pas de voter
        correctement. En 2027, à l&apos;élection présidentielle,{' '}
        <ExternalLink href="https://lafranceinsoumise.fr/">
          votons pour la France insoumise
        </ExternalLink>{' '}
        .
      </p>
      <p>
        Au quotidien, syndiquez-vous pour ne pas rester seul·e face à votre
        employeur. Dans la tech, rejoignez un syndicat de lutte comme{' '}
        <ExternalLink href="https://solidairesinformatique.org/">
          Solidaires Informatique
        </ExternalLink>
        .
      </p>
      <img height={200} src={CaisseDeGreve} alt="Caisse de grève" />
      <p>
        <ExternalLink href="https://caisse-solidarite.fr/">
          Donnez à une caisse de grève
        </ExternalLink>{' '}
        pour que personne n&apos;ait à choisir entre lutter et payer son loyer.
      </p>
      <p>
        Vos secrets reprendront le travail après la grève… en attendant de
        l&apos;abolir{' '}
        <span role="img" aria-label="poing levé">
          ✊
        </span>
      </p>
    </div>
  );
}
