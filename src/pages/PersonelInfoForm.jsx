import { useState } from "react";

const PersonalInfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    kvkk: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tüm zorunlu alanların kontrolü
    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone ||
      !formData.kvkk
    ) {
      alert("Tüm alanları doldurmalı ve KVKK'yı işaretlemelisiniz.");
      return;
    }

    // Form gönderildikten sonra `onSubmit` fonksiyonunu çağır
    onSubmit();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Personal Information Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700"
          >
            Surname*
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <input
            id="kvkk"
            name="kvkk"
            type="checkbox"
            checked={formData.kvkk}
            onChange={handleChange}
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="kvkk" className="ml-2 block text-sm text-gray-900">
            I have read and approved the{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              KVKK text
            </a>
            .
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;