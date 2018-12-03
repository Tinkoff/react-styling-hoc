import React, { Component } from 'react';
import { shallow } from 'enzyme';
import style from '../src';

describe('styleHOC', () => {
    const originStyles = {
        button: 'button_321321312312',
        link: 'link_231312321321321321',
        button_link: 'button_link_2321321321321'
    };

    const themeStyles = {
        button_link: 'button_link_0'
    };

    class BaseClass extends Component {
        render() {
            return null;
        }
    }

    const A = style(originStyles)(BaseClass);

    it('Без кастомных стилей', () => {
        const component = shallow(<A />);

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321' });
    });

    it('Прокидывание стилей', () => {
        const component = shallow(<A themeStyles={themeStyles} />);

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321 button_link_0' });
    });

    it('Прокидывание стили после инициализации компонента', () => {
        const component = shallow(<A />).setProps({ themeStyles });

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321 button_link_0' });
    });

    it('Прокидывание новые уникальные стили', () => {
        const component = shallow(<A themeStyles={{ icon_size_100: 'icon_dsadh2i4' }} />);

        expect(component.prop('styles')).toEqual({ button: 'button_321321312312', link: 'link_231312321321321321', button_link: 'button_link_2321321321321', icon_size_100: 'icon_dsadh2i4' });
    });

    it('Сброс стандартных стилей', () => {
        const component = shallow(<A themeStyles={themeStyles} resetDefaultStyles />);

        expect(component.prop('styles')).toEqual(themeStyles);
    });
});
