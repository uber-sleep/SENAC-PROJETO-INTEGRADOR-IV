import { Button } from "@components/ui/button";
import { useAuth } from "@contexts/Auth";

export const Header = () => {
  const { signOut } = useAuth();

  return (
    <div className="w-full flex justify-end items-center p-3">
      <nav>
        <Button onClick={signOut}>Sair</Button>
      </nav>
    </div>
  );
};
