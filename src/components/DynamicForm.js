import React, { useState } from 'react';

// 1. Конфигурация полей
// В реальном приложении это может приходить с сервера.
// Описываем все возможные параметры, их названия, тип и значение по умолчанию.
const PARAMS_CONFIG = {
    size: { label: 'Размер', type: 'number', defaultValue: 36 },
    color: { label: 'Цвет', type: 'color', defaultValue: '#ff0000' },
    brand: { label: 'Бренд', type: 'text', defaultValue: 'Nike' },
    quantity: { label: 'Количество', type: 'number', defaultValue: 1 },
    notes: { label: 'Заметки', type: 'textarea', defaultValue: '' }
};

// Вспомогательная функция для рендеринга поля ввода в зависимости от его типа
const renderInputField = (key, config, value, handleInputChange) => {
    const commonProps = {
        id: key,
        name: key,
        value: value,
        onChange: handleInputChange,
        className: "mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
        'aria-label': `Значение для ${config.label}`
    };

    if (config.type === 'textarea') {
        return <textarea {...commonProps} rows="3" />;
    }

    return <input type={config.type} {...commonProps} />;
};

const DynamicForm = () => {
    // Состояние для хранения только активных, выбранных параметров
    const [activeParams, setActiveParams] = useState({
        // Задаем начальные значения. 'size' и 'brand' будут активны при загрузке.
        size: PARAMS_CONFIG.size.defaultValue,
        brand: PARAMS_CONFIG.brand.defaultValue,
    });

    // Обработчик для переключения чекбоксов
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        
        setActiveParams(prevParams => {
            if (checked) {
                // Добавляем параметр в состояние с его значением по умолчанию
                return { ...prevParams, [name]: PARAMS_CONFIG[name].defaultValue };
            } else {
                // Удаляем параметр из состояния
                const newParams = { ...prevParams };
                delete newParams[name];
                return newParams;
            }
        });
    };

    // Обработчик для изменения значений в полях ввода
    const handleInputChange = (event) => {
        const { name, value, type } = event.target;
        const finalValue = type === 'number' ? parseInt(value, 10) || 0 : value;

        setActiveParams(prevParams => ({
            ...prevParams,
            [name]: finalValue
        }));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Динамическая форма параметров</h1>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Циклом генерируем все возможные поля из конфигурации */}
                {Object.keys(PARAMS_CONFIG).map((key) => {
                    const config = PARAMS_CONFIG[key];
                    const isChecked = activeParams.hasOwnProperty(key);

                    return (
                        <div key={key} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <label className="flex items-center cursor-pointer text-lg">
                                <input
                                    type="checkbox"
                                    name={key}
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="ml-3 font-medium text-gray-700">{config.label}</span>
                            </label>
                            {/* Поле ввода показывается только если чекбокс активен */}
                            {isChecked && (
                                <div className="mt-3 pl-8">
                                    {renderInputField(key, config, activeParams[key], handleInputChange)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </form>
            <div className="mt-8 bg-gray-100 p-4 rounded-lg">
                <h2 className="font-bold text-xl text-gray-700">Итоговый объект состояния:</h2>
                <pre className="mt-2 text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(activeParams, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default DynamicForm; 