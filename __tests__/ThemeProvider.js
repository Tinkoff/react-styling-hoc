import React, { Component } from 'react';
import { mount } from 'enzyme';
import styleHOC, { ThemeProvider } from '../src';

describe('ThemeProvider', () => {
    const originStyles = {
        button: 'button_321321312312',
        link: 'link_231312321321321321',
        button_link: 'button_link_2321321321321'
    };

    const themeStyles = {
        button_link: 'button_link_0'
    };

    class BaseButton extends Component {
        render() {
            return <div />;
        }
    }

    const Button = styleHOC(originStyles)(BaseButton);

    class Input extends Component {
        render() {
            return <input />;
        }
    }

    it('Прокидывает стили через контекст', () => {
        const wrapper = mount(<ThemeProvider
            themes={[
                {
                    component: Button,
                    themeStyles
                }
            ]}
        >
            <Button />
        </ThemeProvider>);

        const component = wrapper.find(Button).first().children().first();

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321 button_link_0' });
    });

    it('Прокидывает блоки через контекст', () => {
        const themeBlocks = {
            Calendar: <div>21.12.2012</div>
        };

        const wrapper = mount(<ThemeProvider
            themes={[
                {
                    component: Button,
                    themeBlocks
                }
            ]}
        >
            <Button />
        </ThemeProvider>);

        const component = wrapper.find(Button).first().children().first();

        expect(component.prop('themeBlocks')).toEqual(themeBlocks);
    });

    it('Сохраняет верхние темы при вложенности', () => {
        const wrapper = mount(<ThemeProvider
            themes={[
                {
                    component: Button,
                    themeStyles
                }
            ]}
        >
            <ThemeProvider
                themes={[
                    {
                        component: Input,
                        themeStyles: {}
                    }
                ]}
            >
                <Button />
            </ThemeProvider>
        </ThemeProvider>);

        const component = wrapper.find(Button).first().children().first();

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321 button_link_0' });
    });

    it('Переопределяет одинаковые темы при вложенности', () => {
        const wrapper = mount(<ThemeProvider
            themes={[
                {
                    component: Button,
                    themeStyles
                }
            ]}
        >
            <ThemeProvider
                themes={[
                    {
                        component: Button,
                        themeStyles: { link: 'link_1' }
                    }
                ]}
            >
                <Button />
            </ThemeProvider>
        </ThemeProvider>);

        const component = wrapper.find(Button).first().children().first();

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321 link_1', button_link: 'button_link_2321321321321' });
    });
});
