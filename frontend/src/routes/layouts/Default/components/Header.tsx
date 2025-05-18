import { useAuth } from "@contexts/Auth";

export const Header = () => {
  const { signOut } = useAuth();

  return (
    <div>
      <nav>
        <button onClick={signOut}>Sair</button>
      </nav>
    </div>
  );
};
