import React, { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 100%);
  
  @media (max-width: 900px) {
    padding: 30px;
  }
`;

const Logo = styled.h1`
  color: #06b6d4;
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 900px) {
    font-size: 36px;
  }
`;

const Tagline = styled.p`
  color: #cbd5e1;
  font-size: 18px;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    font-size: 16px;
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #cbd5e1;
`;

const FeatureIcon = styled.div`
  font-size: 28px;
`;

const FeatureText = styled.div`
  font-size: 14px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 60px 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 900px) {
    padding: 40px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Text = styled.div`
  font-size: 14px;
  text-align: center;
  color: #cbd5e1;
  margin-top: 20px;
`;

const TextButton = styled.span`
  color: #06b6d4;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    color: #0891b2;
    text-decoration: underline;
  }
`;

const Authentication = () => {
  const [login, setLogin] = useState(false);
  
  return (
    <Container>
      <Left>
        <Logo>Chiranjivi</Logo>
        <Tagline>Your Modern Medical Chat & Consultation Platform</Tagline>
        <Features>
          <Feature>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureText>Real-time messaging with doctors</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>👨‍⚕️</FeatureIcon>
            <FeatureText>Connect with verified medical professionals</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureText>Secure and private consultations</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureText>Instant notifications and responses</FeatureText>
          </Feature>
        </Features>
      </Left>
      
      <Right>
        <FormContainer>
          {!login ? (
            <>
              <SignIn />
              <Text>
                Don't have an account?{" "}
                <TextButton onClick={() => setLogin(true)}>Sign Up</TextButton>
              </Text>
            </>
          ) : (
            <>
              <SignUp />
              <Text>
                Already have an account?{" "}
                <TextButton onClick={() => setLogin(false)}>Sign In</TextButton>
              </Text>
            </>
          )}
        </FormContainer>
      </Right>
    </Container>
  );
};

export default Authentication;
