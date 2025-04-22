import { StatusInscription, Tabs } from "./status";

interface InscriptionProps {
  open: boolean;
  activeTab: Tabs;
}

export const EvmInscription = (props: InscriptionProps) => {
  const { open, activeTab } = props;
  return <StatusInscription activeTab={activeTab} open={open} />;
};

export const SolanaInscription = (props: InscriptionProps) => {
  const { open, activeTab } = props;
  return <StatusInscription activeTab={activeTab} open={open} />;
};
