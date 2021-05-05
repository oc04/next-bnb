import React from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { useSelector, RootState } from "../../store";
import styled from "styled-components";

const Container = styled.div`
  z-index: 11;
`;

interface IProps {
  closeModal: () => void;
}


const AuthModal: React.FC<IProps> = ({ closeModal }) => {
  const authMode = useSelector((state: RootState) => state.auth.authMode);
  
  return (
    <Container>
      {authMode === "signup" && <SignUpModal closeModal={closeModal} />}
      {authMode === "login" && <LoginModal closeModal={closeModal} />}
    </Container>
  );
};

export default AuthModal;