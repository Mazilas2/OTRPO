interface HpProps {
  maxHP: number;
  curHP: number;
}

const CustomHP: React.FC<HpProps> = ({ maxHP, curHP }) => {
  return (
    <>
      <div>Current HP:</div>
      <meter className="w-11/12" value={curHP} max={maxHP} />
    </>
  );
};

export default CustomHP;
