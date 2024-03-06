import {
  AuthContextProvider,
  RegisterContextProvider,
  UserDataProvider,
} from "./context/providers";
import App from "./App";

const AppWrapper = () => {
  return (
    <RegisterContextProvider>
      <AuthContextProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </AuthContextProvider>
    </RegisterContextProvider>
  );
};

export default AppWrapper;
