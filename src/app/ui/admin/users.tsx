"use client";

import {
  getAllUsers,
  UserReadExtended,
  blockUser,
  deleteUser,
} from "@/app/seed/route";
import { useEffect, useState, ChangeEvent, useMemo } from "react";
import {
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { useDebounce } from "@/app/lib/hooks";
import { UserRoleLabels } from "@/app/lib/definitions";

export default function AdminUsersTable() {
  const [users, setUsers] = useState<UserReadExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // Состояние поиска
  const debouncedSearchQuery = useDebounce(searchInput, 300); // Дебаунс поиска

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUsers = async () => {
        try {
          const data = await getAllUsers(token);
          setUsers(data);
        } catch (err) {
          setError("Не удалось загрузить пользователей");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    } else {
      setError("Нет токена аутентификации");
      setLoading(false);
    }
  }, []);

  const handleBlockUnblock = async (
    userId: number,
    currentConsent: boolean,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Нет токена аутентификации");
      return;
    }

    try {
      const updatedUser = await blockUser(userId, token, !currentConsent);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, consent: updatedUser.consent } : user,
        ),
      );
      alert(
        `Пользователь ${updatedUser.consent ? "разблокирован" : "заблокирован"}`,
      );
    } catch (error) {
      alert("Не удалось обновить статус пользователя");
      console.error(error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Нет токена аутентификации");
      return;
    }

    try {
      await deleteUser(userId, token);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert("Пользователь успешно удален");
    } catch (error) {
      alert("Не удалось удалить пользователя");
      console.error(error);
    }
  };

  // Подсветка совпадений в email
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="text-orange-500 underline">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchQuery) return users;
    return users.filter((user) =>
      user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [users, debouncedSearchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="font-semibold text-gray-500">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="font-semibold text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="mb-24 mt-12">
      <h2 className="mb-5 text-3xl font-semibold">Пользователи</h2>

      {/* Поле для поиска по email */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Поиск по email"
          value={searchInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.target.value)
          }
          className="w-full max-w-sm rounded-xl border px-4 py-5 leading-none focus:border-blue focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        {/* Десктопная версия таблицы */}
        <table className="hidden min-w-full rounded-xl bg-white lg:table">
          <thead>
            <tr>
              <th className="border-b p-4 font-semibold">ID</th>
              <th className="border-b p-4 font-semibold">Имя</th>
              <th className="border-b p-4 font-semibold">Фамилия</th>
              <th className="border-b p-4 font-semibold">Email</th>
              <th className="border-b p-4 font-semibold">Телефон</th>
              <th className="border-b p-4 font-semibold">Роль</th>
              <th className="border-b p-4 font-semibold">Статус</th>
              <th className="border-b p-4 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border-b p-4 font-medium">{user.id}</td>
                <td className="border-b p-4 font-medium">{user.first_name}</td>
                <td className="border-b p-4 font-medium">{user.last_name}</td>
                <td className="border-b p-4 font-medium">
                  {highlightMatch(user.email, debouncedSearchQuery)}
                </td>
                <td className="border-b p-4 font-medium">
                  {user.tel || "Не указано"}
                </td>
                <td className="border-b p-4 font-medium">
                  {
                    UserRoleLabels[
                      user.role.name as keyof typeof UserRoleLabels
                    ]
                  }
                </td>
                <td
                  className={`${user.consent ? "text-green-600" : "text-red-600"} border-b p-4 font-medium`}
                >
                  {user.consent ? "Разблокирован" : "Заблокирован"}
                </td>
                <td className="border-b p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      className="hover:opacity-75"
                      onClick={() => handleBlockUnblock(user.id, user.consent)}
                      aria-label={
                        user.consent ? "Заблокировать" : "Разблокировать"
                      }
                    >
                      {user.consent ? (
                        <LockClosedIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <LockOpenIcon className="h-5 w-5 text-green-500" />
                      )}
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(user.id)}
                      aria-label="Удалить"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Мобильная версия карточек */}
        <div className="mt-4 space-y-4 lg:hidden">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Пользователь ID: {user.id}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">
                  <span className="font-semibold">Email:</span>{" "}
                  {highlightMatch(user.email, debouncedSearchQuery)}
                </div>
                <div className="font-medium">
                  <span className="font-semibold">Телефон:</span>{" "}
                  {user.tel || "Не указано"}
                </div>
                <div className="font-medium">
                  <span className="font-semibold">Роль:</span>{" "}
                  {
                    UserRoleLabels[
                      user.role.name as keyof typeof UserRoleLabels
                    ]
                  }
                </div>
                <div className="font-medium">
                  <span className="font-semibold">Статус:</span>{" "}
                  <span
                    className={user.consent ? "text-green-600" : "text-red-600"}
                  >
                    {user.consent ? "Разблокирован" : "Заблокирован"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  className="hover:opacity-75"
                  onClick={() => handleBlockUnblock(user.id, user.consent)}
                  aria-label={user.consent ? "Заблокировать" : "Разблокировать"}
                >
                  {user.consent ? (
                    <LockClosedIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <LockOpenIcon className="h-5 w-5 text-green-500" />
                  )}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(user.id)}
                  aria-label="Удалить"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="mt-4 text-center text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
