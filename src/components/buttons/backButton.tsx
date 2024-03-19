import { BasicButton } from '../Button';
import './backButtonStyle.css';

interface BackButtonProps {
  onButtonClick: () => void; // 点击方法的参数类型为无返回值的函数
}

const Left = ({ containerClassName }: { containerClassName: string }) => (
  <div className={containerClassName}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.68799 8H12.438"
        stroke="#2E2E32"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.37499 11.75L3.625 8L7.37499 4.25"
        stroke="#2E2E32"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const BackButton = (props: BackButtonProps) => {
  return (
    <BasicButton
      classes={{
        outlined: '!py-[10px] !px-[38px] !w-[184px] !text-[#0F1419] !border-[#0F1419]',
      }}
      onClick={props.onButtonClick}
      className="xfans-basic-button"
    >
      <div className="flex items-center justify-center space-x-2 ">
        <Left containerClassName="xfans-left-icon" />
        <span className="text-[15px] font-medium">Go Back</span>
      </div>
    </BasicButton>
  );
};

export default BackButton;
