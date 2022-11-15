import dynamic from 'next/dynamic';

const PopUp = dynamic(() => import('../components/PopUpShell'), {
  ssr: false,
});

export default function Index() {
  return <PopUp />;
}
