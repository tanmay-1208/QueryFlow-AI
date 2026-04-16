package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getCustomers(
        @RequestParam(required = false) Long vaultId
    ) {
        if (vaultId != null) {
            return customerRepository.findByVaultId(vaultId);
        }
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        if (customer.getPriceGroup() == null) {
            customer.setPriceGroup(PriceGroup.RETAIL);
        }
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        customer.setId(id);
        if (customer.getPriceGroup() == null) {
            customer.setPriceGroup(PriceGroup.RETAIL);
        }
        return customerRepository.save(customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
    }
}
