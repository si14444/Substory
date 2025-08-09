import { Redirect } from "expo-router";
import React from "react";

const IndexScreen: React.FC = () => {
  // Redirect 컴포넌트를 사용하여 안전하게 리다이렉트
  return <Redirect href="/home" />;
};

export default IndexScreen;
