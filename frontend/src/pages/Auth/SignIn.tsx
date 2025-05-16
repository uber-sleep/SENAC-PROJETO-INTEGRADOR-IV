import { useAuth } from "@contexts/Auth";

export const SignIn = () => {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    await signIn({ email: "bruno.duarte314@gmail.com", password: "123" });
  };

  return (
    <div>
      <h1>Login</h1> <button onClick={handleSignIn}>Logar</button>
    </div>
  );
};
