import { Component, OnInit } from '@angular/core';
import { InstitutionService } from '../../services/institution.service';
import { Institution } from '../../services/dto/institution.dto';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-institution-tab',
    templateUrl: './institution-tab.component.html',
    styleUrls: ['./institution-tab.component.less'],
})
export class InstitutionTabComponent implements OnInit {
    public institutions: Institution[] = [];
    public displayedColumns: string[] = ["_id", "name", "code", "delete"];

    constructor(private readonly institutionService: InstitutionService) { }

    ngOnInit(): void {
        this.institutionService.institutionList().subscribe((insts) => {
            this.institutions = insts.sort((a, b) => {
                return InstitutionTabComponent.sortStrings(
                    a.name,
                    b.name,
                    false
                );
            });
        });
    }

    onSort(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return;
        }

        const institutions = this.institutions.slice();
        const sortAscending = sort.direction === 'asc';

        this.institutions = institutions.sort((a, b) => {
            switch (sort.active) {
                case '_id':
                    return InstitutionTabComponent.sortStrings(
                        a.name,
                        b.name,
                        sortAscending
                    );
                case 'code':
                    return InstitutionTabComponent.sortStrings(
                        a.code,
                        b.code,
                        sortAscending
                    );
                default:
                    return InstitutionTabComponent.sortStrings(
                        a.name,
                        b.name,
                        sortAscending
                    );
            }
        })
    }

    async deleteInstitution(id: string): Promise<void> {
        console.log(`DELETING ${id}!`);
    }

    private static sortStrings(a: string, b: string, asc = false): number {
        return asc ? b.localeCompare(a) : a.localeCompare(b);
    }
}
