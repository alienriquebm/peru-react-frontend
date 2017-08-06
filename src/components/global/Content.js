import React, { Component } from 'react';

import Formsy from 'formsy-react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { AxiosProvider, Get } from 'react-axios'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


import FormAddProduct from './FormAddProduct'

import './css/Content.css';



class Content extends Component {
    constructor (){
        super();
        this.state = {
            products: null,
            categories: null,
            canSubmit: false
        }
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getAllCategories = this.getAllCategories.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        
        Formsy.addValidationRule('IsEmpty', function (values, value, array) {
            //console.log(value);
            if(value == undefined || value == '' || value == null)  {

                return false;
            } else {
                return true;
            }
            
        });
    }
    addNewProduct(model){
        let self = this;
        axios.post('http://localhost:9001/products/create_product', { productName: model.newProductName, categoryId: model.newProductCategory, price: model.newProductPrice})
            .then(function (response) {
                //console.log(response);
                self.getAllProducts();
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }


    getAllProducts(){
        let self = this;
        axios.get('http://localhost:9001/products/get_product/0')
            .then(function (response){
                self.setState({
                    products: response.data
                })
            }).catch(function(error){
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    getAllCategories() {
        let self = this;
        axios.get('http://localhost:9001/products/get_category/0')
            .then(function (response) {
                self.setState({
                    categories: response.data
                })
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    componentDidMount() {
        this.getAllProducts();
        this.getAllCategories();
    }
    render() {
        var products = [];
        var categories = [];
        
        if(this.state.products){
            products = this.state.products;
            //console.log(products);
        } else {
            products = []
        }

        if(this.state.categories){
            categories = this.state.categories;
            //console.log(categories);
        }

        return (
            <div className="Content">
                <Card>
                    <CardHeader
                        title="Lista de Productos"
                        subtitle="en base de datos"
                    />
                    <CardText>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                    <TableHeaderColumn>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn>Precio</TableHeaderColumn>
                                    <TableHeaderColumn>Categoría</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product,i) => 
                                    <TableRow key={i}>
                                        <TableRowColumn>{product.id}</TableRowColumn>
                                        <TableRowColumn>{product.name}</TableRowColumn>
                                        <TableRowColumn>{product.price}</TableRowColumn>
                                        <TableRowColumn>{product.category.name}</TableRowColumn>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>                                         
                    </CardText>
                    <CardActions>
                        <FlatButton onClick={() => { this.getAllProducts(); }}>
                            Actualizar
                        </FlatButton>
                    </CardActions>
                </Card>
                {this.props.openAddNewProduct == true ? <FormAddProduct listOfCategories={categories} addNewProduct={this.addNewProduct}/> : ''}
            </div>
        );
    }
}

export default Content;
