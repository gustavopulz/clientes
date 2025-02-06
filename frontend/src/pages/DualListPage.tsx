import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaTrash } from 'react-icons/fa';

interface ItemProps {
    id: number;
    text: string;
}

const DualListPage: React.FC = () => {
    const [configList, setConfigList] = useState<ItemProps[]>([]);
    const [list1, setList1] = useState<ItemProps[]>([]);
    const [list2, setList2] = useState<ItemProps[]>([]);
    const [inputValue, setInputValue] = useState('');
    const nextId = useRef(1);

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
        }
    };

    const moveItem = (item: ItemProps, toList: 'list1' | 'list2') => {
        if (toList === 'list1') {
            setList1(prevList1 => {
                if (!prevList1.some(i => i.id === item.id)) {
                    return [...prevList1, item];
                }
                return prevList1;
            });
        } else if (toList === 'list2') {
            setList2(prevList2 => {
                if (!prevList2.some(i => i.id === item.id)) {
                    return [...prevList2, item];
                }
                return prevList2;
            });
        }
    };

    const deleteItem = (item: ItemProps) => {
        setList1(prevList1 => prevList1.filter(i => i.id !== item.id));
        setList2(prevList2 => prevList2.filter(i => i.id !== item.id));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center px-4">
                <div className="w-full max-w-4xl">
                    <h1 className="text-4xl font-medium text-center text-white my-10">Dual List Page</h1>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full p-2 mb-4 border rounded color-white bg-white"
                        placeholder="Adicionar item..." />
                    <button onClick={handleAddItem} className="cursor-pointer w-full p-2 bg-green-500 text-white rounded mb-4">Adicionar</button>
                </div>

                <div className="flex w-full justify-center">
                    <div className="w-225 p-4 bg-white rounded">
                        <h2 className="text-2xl font-medium mb-4">Config</h2>
                        <List items={configList} moveItem={(item) => moveItem(item, 'list1')} listType="config" />
                    </div>
                </div>

                <div className="mt-5 flex w-full max-w-4xl justify-between">
                    <div className="w-1/2 p-4 bg-white rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Lista 1</h2>
                            <TrashBin deleteItem={deleteItem} />
                        </div>
                        <List items={list1} moveItem={(item) => moveItem(item, 'list1')} listType="list1" />
                    </div>
                    <div className="w-1/2 p-4 bg-white rounded ml-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Lista 2</h2>
                            <TrashBin deleteItem={deleteItem} />
                        </div>
                        <List items={list2} moveItem={(item) => moveItem(item, 'list2')} listType="list2" />
                    </div>

                </div>
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
