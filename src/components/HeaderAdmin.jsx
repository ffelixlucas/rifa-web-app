import { useNavigate } from 'react-router-dom';

function HeaderAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-md px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Painel Administrativo
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default HeaderAdmin;
