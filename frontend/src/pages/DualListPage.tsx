import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaTrash } from 'react-icons/fa';
import { MdOutlineClose } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import Sidebar from '../components/Sidebar';

interface ItemProps {
    id: number;
    text: string;
}

const DualListPage: React.FC = () => {
    const [configList, setConfigList] = useState<ItemProps[]>([]);
    const [list1, setList1] = useState<ItemProps[]>([]);
    const [list2, setList2] = useState<ItemProps[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nextId = useRef(1);

    useEffect(() => {
        if (errorMessage) {
            setSuccessMessage('');
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage || deleteMessage) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setSuccessMessage('');
                    setDeleteMessage('');
                    setFadeOut(false);
                }, 500);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, deleteMessage]);

    const handleAddItem = () => {
        if (inputValue.trim()) {
            const newItem = { id: nextId.current++, text: inputValue };
            setConfigList(prevConfigList => {
                if (!prevConfigList.some(item => item.id === newItem.id)) {
                    return [...prevConfigList, newItem];
                }
                return prevConfigList;
            });
            setInputValue('');
            setIsModalOpen(false);
        }
    };

    const moveItem = (item: ItemProps, toList: 'list1' | 'list2') => {
        if (toList === 'list1') {
            setList1(prevList1 => {
                if (!prevList1.some(i => i.id === item.id)) {
                    setErrorMessage('');
                    setSuccessMessage(`Configuração "${item.text}" adicionada na lista 1`);
                    return [...prevList1, item];
                } else {
                    setErrorMessage(`Configuração "${item.text}" já aplicada na lista 1`);
                }
                return prevList1;
            });
        } else if (toList === 'list2') {
            setList2(prevList2 => {
                if (!prevList2.some(i => i.id === item.id)) {
                    setErrorMessage('');
                    setSuccessMessage(`Configuração "${item.text}" adicionada na lista 2`);
                    return [...prevList2, item];
                } else {
                    setErrorMessage(`Configuração "${item.text}" já aplicada na lista 2`);
                }
                return prevList2;
            });
        }
    };

    const deleteItem = (item: ItemProps, fromList: 'list1' | 'list2') => {
        if (fromList === 'list1') {
            setList1(prevList1 => prevList1.filter(i => i.id !== item.id));
            setDeleteMessage(`Configuração "${item.text}" removido da lista 1`);
        } else if (fromList === 'list2') {
            setList2(prevList2 => prevList2.filter(i => i.id !== item.id));
            setDeleteMessage(`Configuração "${item.text}" removido da lista 2`);
        }
    };

    const closeErrorMessage = () => {
        setErrorMessage('');
    };

    const closeSuccessMessage = () => {
        setSuccessMessage('');
    };

    const closeDeleteMessage = () => {
        setDeleteMessage('');
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Sidebar />
            <div className="pl-24 w-full min-h-screen bg-gray-900 flex flex-col items-center px-4 pt-16 md:pt-0">
                <div className="w-full max-w-4xl">
                    <h1 className="-mt-10 md:mt-5 text-4xl font-medium text-center text-white my-10">Dual List Page</h1>
                </div>

                <div className="flex w-full justify-center">
                    <div className="w-full md:w-225 p-4 bg-white rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Config</h2>
                            <button onClick={openModal} className="cursor-pointer flex items-center bg-green-600 text-white px-3 py-1 rounded">
                                <AiOutlinePlus className="mr-2" /> Adicionar novo
                            </button>
                        </div>
                        {errorMessage && (
                            <div className="bg-red-300 text-black p-2 mb-4 rounded flex justify-between items-center">
                                <span>{errorMessage}</span>
                                <button onClick={closeErrorMessage} className="cursor-pointer ml-4 text-xl font-bold"><MdOutlineClose /></button>
                            </div>
                        )}
                        {successMessage && (
                            <div className={`bg-green-300 text-black p-2 mb-4 rounded flex justify-between items-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                                <span>{successMessage}</span>
                                <button onClick={closeSuccessMessage} className="cursor-pointer ml-4 text-xl font-bold"><MdOutlineClose /></button>
                            </div>
                        )}
                        {deleteMessage && (
                            <div className={`bg-yellow-300 text-black p-2 mb-4 rounded flex justify-between items-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                                <span>{deleteMessage}</span>
                                <button onClick={closeDeleteMessage} className="cursor-pointer ml-4 text-xl font-bold"><MdOutlineClose /></button>
                            </div>
                        )}
                        <List items={configList} moveItem={(item) => moveItem(item, 'list1')} listType="config" />
                    </div>
                </div>

                <div className="mt-5 flex flex-col md:flex-row w-full max-w-4xl justify-between">
                    <div className="w-full md:w-1/2 p-4 bg-white rounded mb-4 md:mb-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Lista 1</h2>
                            <TrashBin deleteItem={(item) => deleteItem(item, 'list1')} />
                        </div>
                        <List items={list1} moveItem={(item) => moveItem(item, 'list1')} listType="list1" />
                    </div>
                    <div className="w-full md:w-1/2 p-4 bg-white rounded md:ml-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Lista 2</h2>
                            <TrashBin deleteItem={(item) => deleteItem(item, 'list2')} />
                        </div>
                        <List items={list2} moveItem={(item) => moveItem(item, 'list2')} listType="list2" />
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50">
                        <div className="bg-gray-800 text-white p-4 rounded relative">
                            <button onClick={closeModal} className="cursor-pointer absolute top-2 right-2 text-xl"><MdOutlineClose /></button>
                            <h2 className="text-2xl mb-4">Adicionar novo item</h2>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="placeholder:text-gray-500 w-full p-2 mb-4 border rounded"
                                placeholder="Adicionar item..."
                            />
                            <button onClick={handleAddItem} className="cursor-pointer w-full p-2 bg-green-500 text-white rounded">Adicionar</button>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

const List: React.FC<{ items: ItemProps[], moveItem: (item: ItemProps, toList: 'list1' | 'list2') => void, listType: 'config' | 'list1' | 'list2' }> = ({ items, moveItem, listType }) => {
    const [, drop] = useDrop({
        accept: 'ITEM',
        drop: (draggedItem: ItemProps) => {
            if (listType !== 'config') {
                moveItem(draggedItem, listType);
            }
        },
    });

    return (
        <div ref={drop} className="min-h-[200px] p-2 border rounded">
            {items.map(item => (
                <ListItem key={item.id} item={item} moveItem={moveItem} currentList={listType} />
            ))}
        </div>
    );
};

const ListItem: React.FC<{ item: ItemProps, moveItem: (item: ItemProps, toList: 'list1' | 'list2') => void, currentList: 'config' | 'list1' | 'list2' }> = ({ item, moveItem, currentList }) => {
    const [, ref] = useDrag({
        type: 'ITEM',
        item,
    });

    const handleClick = () => {
        const toList = currentList === 'list1' ? 'list2' : 'list1';
        moveItem(item, toList);
    };

    return (
        <div ref={ref} onClick={handleClick} className="p-2 mb-2 rounded bg-gray-200 cursor-pointer">
            {item.text}
        </div>
    );
};

const TrashBin: React.FC<{ deleteItem: (item: ItemProps) => void }> = ({ deleteItem }) => {
    const [, drop] = useDrop({
        accept: 'ITEM',
        drop: (draggedItem: ItemProps) => {
            deleteItem(draggedItem);
        },
    });

    return (
        <div ref={drop} className="p-2 bg-red-500 text-white rounded cursor-pointer">
            <FaTrash />
        </div>
    );
};

export default DualListPage;
